package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A VersionApplicable.
 */
@Entity
@Table(name = "version_applicable")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class VersionApplicable implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "uid_version_applicable", nullable = false, unique = true)
    private String uidVersionApplicable;

    @NotNull
    @Column(name = "name_version_applicable", nullable = false, unique = true)
    private String nameVersionApplicable;

    @Column(name = "comment")
    private String comment;

    @Column(name = "description")
    private String description;

    @Column(name = "create_date")
    private String createDate;

    @Column(name = "modify_by")
    private String modifyBy;

    @Column(name = "modifid_date")
    private String modifidDate;

    @OneToMany(mappedBy = "versionApplicable")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "versionApplicable", "versionCible", "product" }, allowSetters = true)
    private Set<Update> updates = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "versionApplicables", "versionCibles", "updates" }, allowSetters = true)
    private Product product;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public VersionApplicable id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUidVersionApplicable() {
        return this.uidVersionApplicable;
    }

    public VersionApplicable uidVersionApplicable(String uidVersionApplicable) {
        this.setUidVersionApplicable(uidVersionApplicable);
        return this;
    }

    public void setUidVersionApplicable(String uidVersionApplicable) {
        this.uidVersionApplicable = uidVersionApplicable;
    }

    public String getNameVersionApplicable() {
        return this.nameVersionApplicable;
    }

    public VersionApplicable nameVersionApplicable(String nameVersionApplicable) {
        this.setNameVersionApplicable(nameVersionApplicable);
        return this;
    }

    public void setNameVersionApplicable(String nameVersionApplicable) {
        this.nameVersionApplicable = nameVersionApplicable;
    }

    public String getComment() {
        return this.comment;
    }

    public VersionApplicable comment(String comment) {
        this.setComment(comment);
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getDescription() {
        return this.description;
    }

    public VersionApplicable description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCreateDate() {
        return this.createDate;
    }

    public VersionApplicable createDate(String createDate) {
        this.setCreateDate(createDate);
        return this;
    }

    public void setCreateDate(String createDate) {
        this.createDate = createDate;
    }

    public String getModifyBy() {
        return this.modifyBy;
    }

    public VersionApplicable modifyBy(String modifyBy) {
        this.setModifyBy(modifyBy);
        return this;
    }

    public void setModifyBy(String modifyBy) {
        this.modifyBy = modifyBy;
    }

    public String getModifidDate() {
        return this.modifidDate;
    }

    public VersionApplicable modifidDate(String modifidDate) {
        this.setModifidDate(modifidDate);
        return this;
    }

    public void setModifidDate(String modifidDate) {
        this.modifidDate = modifidDate;
    }

    public Set<Update> getUpdates() {
        return this.updates;
    }

    public void setUpdates(Set<Update> updates) {
        if (this.updates != null) {
            this.updates.forEach(i -> i.setVersionApplicable(null));
        }
        if (updates != null) {
            updates.forEach(i -> i.setVersionApplicable(this));
        }
        this.updates = updates;
    }

    public VersionApplicable updates(Set<Update> updates) {
        this.setUpdates(updates);
        return this;
    }

    public VersionApplicable addUpdate(Update update) {
        this.updates.add(update);
        update.setVersionApplicable(this);
        return this;
    }

    public VersionApplicable removeUpdate(Update update) {
        this.updates.remove(update);
        update.setVersionApplicable(null);
        return this;
    }

    public Product getProduct() {
        return this.product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public VersionApplicable product(Product product) {
        this.setProduct(product);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof VersionApplicable)) {
            return false;
        }
        return id != null && id.equals(((VersionApplicable) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "VersionApplicable{" +
            "id=" + getId() +
            ", uidVersionApplicable='" + getUidVersionApplicable() + "'" +
            ", nameVersionApplicable='" + getNameVersionApplicable() + "'" +
            ", comment='" + getComment() + "'" +
            ", description='" + getDescription() + "'" +
            ", createDate='" + getCreateDate() + "'" +
            ", modifyBy='" + getModifyBy() + "'" +
            ", modifidDate='" + getModifidDate() + "'" +
            "}";
    }
}
